import React from 'react';
import { Radio, Form } from 'antd';

const RadioCardGroup = ({
  name,
  options,
  formItemProps = {},
  radioGroupProps = {},
  initialValue,
  required = true,
  requiredMessage = 'Please select an option'
}) => {
  return (
    <Form.Item
      name={name}
      rules={[
        { 
          required, 
          message: requiredMessage 
        }
      ]}
      initialValue={initialValue}
      {...formItemProps}
    >
      <Radio.Group className="w-full" {...radioGroupProps}>
        <div className="grid gap-4">
          {options.map((option) => (
            <Radio 
              key={option.value}
              value={option.value}
              className="rf-choice group w-full !p-0 [&_.ant-radio]:!hidden"
            >
              <div className="relative w-full rounded-xl border border-[#E6E6E6] bg-white p-4 group-[.ant-radio-wrapper-checked]:border-[#4F46E5] group-[.ant-radio-wrapper-checked]:bg-[#F9F9FD] group-[.ant-radio-wrapper-checked]:shadow-[inset_0_0_0_2px_rgba(79,70,229,0.20)]">
                <div className="absolute top-3 right-3">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 group-[.ant-radio-wrapper-checked]:bg-[#4F46E5] group-[.ant-radio-wrapper-checked]:border-[#4F46E5] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className="flex items-start gap-3 pr-6">
                  {option.icon && (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E6E6E6] bg-[#F4F4FB]">
                      {option.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-[#4F46E5] leading-[1.2]">
                      {option.title}
                    </div>
                    {option.description && (
                      <p className="mt-1 text-gray-500 !mb-0">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Radio>
          ))}
        </div>
      </Radio.Group>
    </Form.Item>
  );
};

export default RadioCardGroup;
