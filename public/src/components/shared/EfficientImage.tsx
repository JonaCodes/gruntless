import { Image, ImageProps } from '@mantine/core';
import { observer } from 'mobx-react-lite';

interface EfficientImageProps extends Omit<ImageProps, 'src'> {
  name: string;
  height?: number;
  width?: number;
  contain?: boolean;
  lazy?: boolean;
  alt?: string;
  withBackgroundRemoval?: boolean;
}

const EfficientImage = observer(
  ({
    name,
    width,
    height,
    contain = true,
    lazy = true,
    alt,
    withBackgroundRemoval = false,
    ...rest
  }: EfficientImageProps) => {
    // https://res.cloudinary.com/aptsphereimages/image/upload/e_background_removal/f_png/v1761469383/professional/jona-builders-kickoff-2025.jpg
    const base = `https://res.cloudinary.com/aptsphereimages/image/upload${withBackgroundRemoval ? '/e_background_removal' : ''}`;
    const transform = [
      width ? `w_${width}` : null,
      height ? `h_${height}` : null,
      'q_auto',
      'f_auto',
    ]
      .filter(Boolean)
      .join(',');

    const src = `${base}/${transform}/${name}`;

    return (
      <Image
        src={src}
        fallbackSrc={'src/assets/fallback-image.webp'}
        alt={alt || name}
        loading={lazy ? 'lazy' : 'eager'}
        fit={contain ? 'contain' : undefined}
        {...rest}
      />
    );
  }
);

export default EfficientImage;
