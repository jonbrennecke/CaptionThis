// @flow
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';
import values from 'lodash/values';

import { UI_COLORS } from '../../constants';
import * as Fonts from '../../utils/Fonts';
import FlagView from './FlagView';

import type { Style } from '../../types/react';
import type { LocaleObject } from '../../types/speech';

type Props = {
  style?: ?Style,
  locales: LocaleObject[],
};

const styles = {
  container: {},
  localeItem: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textWrap: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 15,
  },
  flagOutline: {
    backgroundColor: 'transparent',
    height: 35,
    width: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: UI_COLORS.WHITE,
    shadowOpacity: 1,
    shadowColor: UI_COLORS.DARK_GREY,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 2,
  },
  flagWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 17.5,
  },
  fill: StyleSheet.absoluteFillObject,
  languageText: {
    ...Fonts.getFontStyle('heading', { contentStyle: 'lightContent' }),
  },
};

export default function FlagList({ style, locales }: Props) {
  const grouped = groupBy(locales, l => l.language.code);
  const groupedMappedLocales = values(grouped).map(locales => {
    const hasMultiple = locales.length > 1;
    return locales.map(locale => {
      const nameWithoutCountry = locale.language.localizedStrings.currentLocale;
      const nameWithCountry = `${nameWithoutCountry} - ${
        locale.country.localizedStrings.currentLocale
      }`;
      return {
        displayName: hasMultiple ? nameWithCountry : nameWithoutCountry,
        ...locale,
      };
    });
  });
  const sortedLocales = flatMap(
    sortBy(groupedMappedLocales, l => l[0].displayName)
  );
  return (
    <View style={[styles.container, style]}>
      {sortedLocales.map(locale => (
        <View
          key={`${locale.language.code}-${locale.country.code}`}
          style={styles.localeItem}
        >
          <View style={styles.flagOutline}>
            <View style={styles.flagWrap}>
              {locale.country.code && (
                <FlagView
                  countryCode={locale.country.code}
                  style={styles.fill}
                />
              )}
            </View>
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.languageText} numberOfLines={1}>
              {`${locale.displayName}`}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
