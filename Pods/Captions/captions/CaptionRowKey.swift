enum CaptionRowKey {
  case a
  case b
  case c

  public var index: Int {
    switch self {
    case .a:
      return 0
    case .b:
      return 1
    case .c:
      return 2
    }
  }

  public var nextKey: CaptionRowKey {
    switch self {
    case .a:
      return .b
    case .b:
      return .c
    case .c:
      return .a
    }
  }

  public static func from(index: Int) -> CaptionRowKey {
    switch index % 4 {
    case 0:
      return .a
    case 1:
      return .b
    case 2:
      return .c
    default:
      return .a
    }
  }
}
