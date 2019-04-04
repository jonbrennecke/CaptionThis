import Foundation

func clamp<T: Comparable>(_ number: T, from: T, to: T) -> T {
  return min(max(number, from), to)
}
