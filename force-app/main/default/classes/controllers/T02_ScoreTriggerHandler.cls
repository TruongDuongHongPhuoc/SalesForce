public class T02_ScoreTriggerHandler {
    public T02_ScoreTriggerHandler() {

    }

    public void updateAverageScores(Set<Id> subjectScoreIds) {
        // Exam types required for calculation
        Set<String> requiredExamTypes = new Set<String>{'Progress', 'Practical', 'Midterm_Exam', 'FinalTerm_Exam'};
        
        // Map to store scores for each SubjectScore__c
        Map<Id, Map<String, Decimal>> scoreMap = new Map<Id, Map<String, Decimal>>();

        // Query scores related to SubjectScore__c
        for (Score__c score : [SELECT SubjectScore_look__c, Score__c, ExamType__c FROM Score__c WHERE SubjectScore_look__c IN :subjectScoreIds]) {
            if (!scoreMap.containsKey(score.SubjectScore_look__c)) {
                scoreMap.put(score.SubjectScore_look__c, new Map<String, Decimal>());
            }
            scoreMap.get(score.SubjectScore_look__c).put(score.ExamType__c, score.Score__c);
        }

        // Prepare updates for SubjectScore__c
        List<SubjectScore__c> subjectScoresToUpdate = new List<SubjectScore__c>();

        for (Id subjectScoreId : scoreMap.keySet()) {
            Map<String, Decimal> scores = scoreMap.get(subjectScoreId);
            
            // Check if we have all 4 required exam types
            if (scores.keySet().containsAll(requiredExamTypes)) {
                Decimal totalScore = 0;
                for (String examType : requiredExamTypes) {
                    totalScore += scores.get(examType);
                }
                Decimal averageScore = totalScore / requiredExamTypes.size();

                subjectScoresToUpdate.add(new SubjectScore__c(
                    Id = subjectScoreId,
                    AverageScore__c = averageScore
                ));
            } else {
                // If not all 4 exam types are present, set AverageScore__c to NULL
                subjectScoresToUpdate.add(new SubjectScore__c(
                    Id = subjectScoreId,
                    AverageScore__c = null
                ));
            }
        }

        if (!subjectScoresToUpdate.isEmpty()) {
            update subjectScoresToUpdate;
            System.debug('✅ Updated Average Scores for ' + subjectScoresToUpdate.size() + ' Subject Scores.');
        }
    }

}