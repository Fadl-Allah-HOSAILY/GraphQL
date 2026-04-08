export const query = `
query {
  user {
    id
    login
    auditRatio
    totalDown
    totalUp

    success: audits_aggregate(where: { closureType: { _eq: succeeded } }) {
      aggregate { count }
    }

    failed: audits_aggregate(where: { closureType: { _eq: failed } }) {
      aggregate { count }
    }

    cohort: events(where: {cohorts: {labelName: {_is_null: false}}}) {
      cohorts {
        labelName
      }
    }
  }

  totalXP: transaction_aggregate(
    where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }
  ) {
    aggregate { sum { amount } }
  }

  lvl: transaction_aggregate(
    where: { type: { _eq: "level" }, event: { object: { name: { _eq: "Module" } } } }
  ) {
    aggregate { max { amount } }
  }

  skills: transaction(
    where: { type: { _ilike: "%skill%" } }
    order_by: { amount: desc }
  ) {
    type
    amount
  }
}
`;