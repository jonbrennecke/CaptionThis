// NOTE: there appears to be a good Swift implementation of Result type here:
// https://github.com/regexident/Result/blob/master/Result/Result.swift
enum Result<T, E> {
  case ok(T)
  case err(E)
}
