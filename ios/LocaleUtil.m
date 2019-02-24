#import "LocaleUtil.h"

@implementation LocaleUtil (Private)

+ (id)objectOrNull:(id)object {
  return object ?: [NSNull null];
}

@end

@implementation LocaleUtil

+ (NSDictionary *)jsonify:(NSLocale *)locale {
  //  NSString *languageCode = locale.languageCode;
  //  NSString *countryCode = locale.countryCode;
  //  NSString *localizedLanguageCode =
  //      [locale localizedStringForLanguageCode:languageCode];
  //  NSString *localizedCountryCode =
  //      [locale localizedStringForCountryCode:countryCode];
  //  return @{
  //    @"language" : @{
  //      @"code" : [LocaleUtil objectOrNull:languageCode],
  //      @"localizedStrings" : @{
  //        @"languageLocale" : [LocaleUtil objectOrNull:localizedLanguageCode],
  //        @"currentLocale" : [LocaleUtil objectOrNull:localizedLanguageCode],
  //      }
  //    },
  //    @"country" : @{
  //      @"code" : [LocaleUtil objectOrNull:countryCode],
  //      @"localizedStrings" : @{
  //        @"languageLocale" : [LocaleUtil objectOrNull:localizedCountryCode],
  //        @"currentLocale" : [LocaleUtil objectOrNull:localizedCountryCode],
  //      }
  //    }
  //  };
  NSLocale *currentLocale = NSLocale.currentLocale;
  NSString *languageCode = locale.languageCode;
  NSString *countryCode = locale.countryCode;
  NSString *localizedLanguageCode =
      [locale localizedStringForLanguageCode:languageCode];
  NSString *localizedCountryCode =
      [locale localizedStringForCountryCode:countryCode];
  NSString *countryCodeInCurrentLocale =
      [currentLocale localizedStringForCountryCode:countryCode];
  NSString *languageCodeInCurrentLocale =
      [currentLocale localizedStringForLanguageCode:languageCode];
  return @{
    @"language" : @{
      @"code" : [LocaleUtil objectOrNull:languageCode],
      @"localizedStrings" : @{
        @"languageLocale" : [LocaleUtil objectOrNull:localizedLanguageCode],
        @"currentLocale" :
            [LocaleUtil objectOrNull:languageCodeInCurrentLocale],
      }
    },
    @"country" : @{
      @"code" : [LocaleUtil objectOrNull:countryCode],
      @"localizedStrings" : @{
        @"languageLocale" : [LocaleUtil objectOrNull:localizedCountryCode],
        @"currentLocale" : [LocaleUtil objectOrNull:countryCodeInCurrentLocale],
      }
    }
  };
}

@end
