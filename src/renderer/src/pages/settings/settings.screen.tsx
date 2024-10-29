import * as React from 'react';
import { Field, Input, Select, SelectTabData, SelectTabEvent } from '@fluentui/react-components';

type SettingsFieldProps = {
  label: string;
  group: string;
  code: string;
  options?: {
    label: string;
    value: string;
  }[];
};
export const SettingsField: React.FC<SettingsFieldProps> = ({ label, group, code, options }) => {
  const settings = useSettings(group, code, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    settings.set(value);
  };
  if (settings.isLoading) {
    return <>LOADING</>;
  }
  return (
    <Field label={label} onChange={handleChange}>
      {options && (
        <Select defaultValue={settings.value}>
          {options.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
      {!options && <Input defaultValue={settings.value} />}
    </Field>
  );
};

const settings = [
  {
    label: 'Preferences',
    code: 'PREFERENCES',
    items: [
      {
        code: 'THEME',
        label: 'Theme',
        options: [
          {
            label: 'Light',
            value: 'light'
          },
          {
            label: 'Dark',
            value: 'dark'
          }
        ]
      }
    ]
  },
  {
    label: 'Api Keys',
    code: 'API_KEYS',
    items: [
      {
        code: 'OPENAI_API_KEY',
        label: 'OpenAI API Key'
      },
      {
        code: 'ELEVENLABS_API_KEY',
        label: 'ElevenLabs API Key'
      },
      {
        code: 'GEMINI_API_KEY',
        label: 'Gemini API Key'
      }
    ]
  }
];

import { makeStyles, Tab, TabList } from '@fluentui/react-components';
import { useSettings } from '@renderer/hooks/use-settings';

const useStyles = makeStyles({
  root: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: '50px'
  }
});

export const SettingsScreen = () => {
  const defaultTab = settings[0].code;
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const styles = useStyles();

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value as any);
  };

  return (
    <div className={styles.root}>
      <div>
        <TabList onTabSelect={onTabSelect} defaultSelectedValue={defaultTab} vertical>
          {settings.map((setting) => (
            <Tab key={setting.code} value={setting.code}>
              {setting.label}
            </Tab>
          ))}
        </TabList>
      </div>
      <div>
        {settings.map((setting) => (
          <div key={setting.code} hidden={activeTab !== setting.code}>
            {setting.items.map((item) => (
              <SettingsField
                key={item.code}
                options={item.options}
                label={item.label}
                group={setting.code}
                code={item.code}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
