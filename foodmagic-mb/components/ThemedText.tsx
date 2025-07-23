import { Text, type TextProps, StyleSheet } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = lightColor; // Por simplicidad, usamos light por defecto

  return (
    <Text
      style={[
        { color },
        styles.default,
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Rubik',
    color: '#424242',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: 'Rubik',
    color: '#424242',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    fontFamily: 'Rubik',
    color: '#212121',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Rubik',
    color: '#424242',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#D32F2F',
    fontFamily: 'Rubik',
    fontWeight: '600',
  },
});
