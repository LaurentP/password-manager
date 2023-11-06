import type { AccountData } from '../typings/AccountData'

// Sort by usedAt
const sortData = (a: AccountData, b: AccountData): number => {
  let comparison: number = 0

  if (a.usedAt > b.usedAt) {
    comparison = -1
  } else if (a.usedAt < b.usedAt) {
    comparison = 1
  }

  return comparison
}

export default sortData
