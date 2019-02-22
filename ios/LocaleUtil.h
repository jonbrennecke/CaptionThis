#pragma once

#import <React/RCTConvert.h>

@interface LocaleUtil : NSObject
+ (NSDictionary *)jsonify:(NSLocale *)locale;
@end

@interface LocaleUtil (Private)
+ (id)objectOrNull:(id)object;
@end
