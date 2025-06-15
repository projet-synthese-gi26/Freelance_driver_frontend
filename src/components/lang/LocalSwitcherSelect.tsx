'use client';

import { CheckIcon, GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import * as Select from "@radix-ui/react-select";
import clsx from 'clsx';
import { useEffect, useState, useTransition } from 'react';
import { Locale } from '@/config';
import { setUserLocale } from '@/service/locale';
import { useTranslations } from 'next-intl';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
  status: string;
};

export default function LocaleSwitcherSelect({
                                               defaultValue,
                                               items,
                                               label,
                                               status
                                             }: Props) {
  const t = useTranslations("Freelance.footer");
  const [isPending, startTransition] = useTransition();
  const [lang, setLang] = useState(t("language"));
  const [langD, setLangD] = useState(t("languageDark"));

  useEffect(() => {
    // Function to update language state based on locale
    const updateLanguage = (locale: string) => {
      switch (locale) {
        case 'en':
          setLangD('EN');
          setLang('English');
          break;
        case 'fr':
          setLangD('FR');
          setLang('Français');
          break;
        case 'de':
          setLangD('DE');
          setLang('Deutsch');
          break;
        case 'es':
          setLangD('ES');
          setLang('Spanish');
          break;
        default:
          setLangD(t("languageDark"));
          setLang(t("language"));
      }
    };

    // Update language state when the defaultValue changes
    updateLanguage(defaultValue);
  }, [defaultValue, t]);

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
      <div className="relative">
        {status === 'dark' && (
            <h4 className="text-xl font-semibold flex flex-row items-center">
              <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
                <Select.Trigger
                    aria-label={label}
                    className={clsx(
                        'rounded-sm px-2 transition-colors',
                        isPending && 'pointer-events-none opacity-60'
                    )}
                >
                  <Select.Icon>
                    <div className='flex flex-row items-center'>
                      <p className="text font-medium text-[#171d4d]">
                        <GlobeAltIcon className="text-[#171d4d] w-5 h-5" />
                      </p>
                      <p className="text font-medium text-[#171d4d]">{langD}</p>
                    </div>
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content
                      align="end"
                      className="min-w-[8rem] overflow-hidden rounded-sm bg-white shadow-md"
                      position="popper"
                  >
                    <Select.Viewport>
                      {items.map((item) => (
                          <Select.Item
                              key={item.value}
                              className="flex cursor-default items-center px-3 py-2 text-base data-[highlighted]:bg-slate-100"
                              value={item.value}
                          >
                            <div className="mr-2 w-[1rem]">
                              {item.value === defaultValue && (
                                  <CheckIcon className="h-5 w-5 text-slate-600" />
                              )}
                            </div>
                            <span className="text-slate-900">{item.label}</span>
                          </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.Arrow className="fill-white text-white" />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </h4>
        )}
        {status !== 'dark' && (
            <h4 className="text-xl font-semibold mb-6 flex flex-row items-center">
              <GlobeAltIcon className="text-white w-[1.5rem] h-[1.5rem]" />
              <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
                <Select.Trigger
                    aria-label={label}
                    className={clsx(
                        'rounded-sm px-2 transition-colors hover:bg-[#171d4d] duration-500',
                        isPending && 'pointer-events-none opacity-60'
                    )}
                >
                  <Select.Icon>
                    <div className='flex flex-row'>
                      <p className="text-[15px] font-semibold text-white">{lang}</p>
                      <ChevronDownIcon className='text-white w-[1.5rem] h-[1.5rem]' />
                    </div>
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content
                      align="end"
                      className="min-w-[8rem] overflow-hidden rounded-sm bg-white shadow-md"
                      position="popper"
                  >
                    <Select.Viewport>
                      {items.map((item) => (
                          <Select.Item
                              key={item.value}
                              className="flex cursor-default items-center px-3 py-2 text-base data-[highlighted]:bg-slate-100"
                              value={item.value}
                          >
                            <div className="mr-2 w-[1rem]">
                              {item.value === defaultValue && (
                                  <CheckIcon className="h-5 w-5 text-slate-600" />
                              )}
                            </div>
                            <span className="text-slate-900">{item.label}</span>
                          </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.Arrow className="fill-white text-white" />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </h4>
        )}
      </div>
  );
}