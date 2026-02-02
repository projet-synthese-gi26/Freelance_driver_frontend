
import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcherSelect from './LocalSwitcherSelect';

interface props{
    status: string;
}

export default function LocaleSwitcher({status}:props) {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale();

    if (locale === 'en') {
        return null;
    }

    return (


        <LocaleSwitcherSelect
            defaultValue={locale}
            items={[
                {
                    value: 'en',
                    label: 'English'
                },
                
            ]}
            label={t('label')}
            status={status}
        />

    );
}