import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcherSelectDark from './LocalSwitcherSelectDark';

export default function LocaleSwitcher() {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale();

    return (
        <LocaleSwitcherSelectDark
            defaultValue={locale}
            items={[
                {
                    value: 'en',
                    label: 'EN'
                },
                {
                    value: 'fr',
                    label: 'FR'
                },
                {
                    value: 'de',
                    label: 'DE'
                },
                {
                    value: 'es',
                    label: 'ES'
                }
            ]}
            label={t('label')}
        />
    );
}