'use client';

import {CheckIcon, GlobeAltIcon,ChevronDownIcon,LanguageIcon} from '@heroicons/react/24/solid';
import * as Select from "@radix-ui/react-select"
import clsx from 'clsx';
import {useState, useTransition} from 'react';
import {Locale} from '@/config';
import {setUserLocale} from '@/service/locale';
import {useTranslations} from 'next-intl'
type Props = {
  defaultValue: string;
  items: Array<{value: string; label: string}>;
  label: string;
};

export default function LocaleSwitcherSelect({
                                               defaultValue,
                                               items,
                                               label
                                             }: Props) {
  const t= useTranslations("Freelance.footer")
  const [isPending, startTransition] = useTransition();
  const [lang,setLang]=useState(t("languageDark"))
  function onChange(value: string) {
    const locale = value as Locale;
    if (locale==='en') {
      setLang('EN')
    }
    if (locale==='fr') {
      setLang('FR')
    }
    if (locale==='de') {
      setLang('DE')
    }
    if (locale==='es') {
      setLang('ES')
    }

    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
      <div className="relative flex items-center z-10">
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
                <div className='flex flex-row '>
                  <p className="text-[18px] font-medium text-[#171d4d]"><GlobeAltIcon className="text-[#171d4d] w-7 h-7"/></p>
                  <p className="text-[18px] font-medium text-[#171d4d]">{lang}</p>
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
      </div>
  );
}