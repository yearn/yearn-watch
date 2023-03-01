import React, {ReactElement, useState} from 'react';
import Image, {ImageProps} from 'next/image';

type TImageWithFallbackProps = {
	fallbackElement?: ReactElement;
  } & ImageProps

const ImageWithFallback = (props: TImageWithFallbackProps): ReactElement => {
	const {alt, fallbackElement, ...rest} = props;
	const [isError, set_isError] = useState(false);

	const potentialImage = (
		<Image
			alt={alt}
			{...rest}
			onError={(): void => {
				set_isError(true);
			}}
		/>
	);

	const placeholder = fallbackElement ?? <div className={'h-10 min-h-[40px] w-10 min-w-[40px] rounded-full bg-neutral-200'} />;

	return isError ? placeholder : potentialImage;
};

export default ImageWithFallback;
