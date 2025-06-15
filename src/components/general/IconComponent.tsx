import React, { FC } from 'react'
import Image, { StaticImageData } from 'next/image'

interface IconComponentProps {
    Icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>> | StaticImageData;
    className?: string;
    alt?: string;
}

const IconComponent: FC<IconComponentProps> = ({ Icon, className, alt = '' }) => {
    const isImage = typeof Icon === 'object' && 'src' in Icon;

    return (
        <div className={`inline-flex items-center justify-center ${className}`}>
            {isImage ? (
                <Image
                    src={Icon as StaticImageData}
                    alt={alt}
                    width={24}
                    height={24}
                    className="object-contain"
                />
            ) : (
                <Icon className={className} />
            )}
        </div>
    )
}

export default IconComponent