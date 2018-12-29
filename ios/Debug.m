#import "Debug.h"

@implementation Debug (ObjC)

+(void)logWithFormat:(NSString*)format, ... {
  NSMutableArray<id> *args = [[NSMutableArray alloc] init];
  va_list varargs;
  va_start(varargs, format);
  for (id arg = va_arg(varargs, id); arg != nil; arg = va_arg(varargs, id)) {
    [args addObject:arg];
  }
  va_end(varargs);
  [self logWithFormat:format arguments:args];
}

@end
