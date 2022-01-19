from strawberry.tools import create_type

from .dashboard import (
    count_sample_group_by_status,
    count_sample_group_by_action,
    count_analyte_group_by_status,
    count_worksheet_group_by_status,
    count_analyte_group_by_instrument,
    sample_process_performance,
    analysis_process_performance,
    sample_laggards,
    test_stuff
)


AnalyticsQuery = create_type(
    "Query",
    [
        count_sample_group_by_status,
        count_sample_group_by_action,
        count_analyte_group_by_status,
        count_worksheet_group_by_status,
        count_analyte_group_by_instrument,
        sample_process_performance,
        analysis_process_performance,
        sample_laggards,
        test_stuff
    ],
)



"""
query {
  sampleProcessPerformance(
    startDate: "10-20-2017",
    endDate: "10-10-2022"
  ) {
    __typename
    data {
      process
      counts {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
      }
    }
  }
}

query {
  analysisProcessPerformance(
    process: "verified_to_published",
    startDate: "10-20-2017",
    endDate: "10-10-2022"
  ) {
    __typename
    data {
      process
      groups {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
        service
      }
    }
  }
}

query {
  countSampleGroupByAction {
    __typename
    data {
      __typename
      group
      counts {
      __typename
        group
        count
      }
    }
  }
}

query {
	sampleLaggards {
     __typename
    data {
        __typename
      category
      counts {
        __typename
        totalIncomplete
        totalDelayed
        totalNotDelayed
        lessThanTen
        tenToTwenty
        twentyToThirty
        graterThanThirty
      }
    }
  }
}
"""