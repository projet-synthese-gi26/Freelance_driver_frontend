
import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcherSelect from './LocalSwitcherSelect';

interface props{
    status: string;
}

export default function LocaleSwitcher({status}:props) {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale();

    return (


        <LocaleSwitcherSelect
            defaultValue={locale}
            items={[
                {
                    value: 'en',
                    label: 'English'
                },
                {
                    value: 'fr',
                    label: 'Français'
                },
                {
                    value: 'de',
                    label: 'Deutsh'
                },
                {
                    value: 'es',
                    label: 'Spanish'
                }
            ]}
            label={t('label')}
            status={status}
        />

    );
}