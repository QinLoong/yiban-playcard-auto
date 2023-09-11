import { DailySignSubmitRequest } from '../../user/dto/dailySignSubmit.dto'; // 导入DailySignSubmitRequest类型
import { signFormData } from './signConfigDTO'; // 导入signFormData类型

// 创建一个类型，表示signFormData的字段名称
type signFormDataKey = keyof signFormData;

// 创建一个类型，表示DailySignSubmitRequest的字段名称
type DailySignSubmitRequestKey = keyof DailySignSubmitRequest;

// 创建一个类型，表示从signFormData字段到DailySignSubmitRequest字段的映射关系
export type SignConfig2DailySignSubmitRequestDTOMappingType = {
  [k in signFormDataKey]: DailySignSubmitRequestKey;
};

// 创建一个映射，将signFormData字段映射到DailySignSubmitRequest字段
export const SignFormData2DailySignSubmitRequestDTOMapping: SignConfig2DailySignSubmitRequestDTOMappingType =
  {
    address: 'dkdz',
    position: 'dkdzZb',
    signAddress: 'dkd',
    provinceZipCode: 'jzdSheng.dm',
    cityZipCode: 'jzdShi.dm',
    countyZipCode: 'jzdXian.dm',
    habitationDetailDesc: 'jzdDz',
    usualResidenceDetailDesc: 'jzdDz2',
    phone: 'lxdh',
  };

// 函数将signFormData映射为Partial<DailySignSubmitRequest>类型
export function signForm2DailySignSubmitRequestDTOMapping(
  config: signFormData,
) {
  const res: Partial<DailySignSubmitRequest> = {};

  // 遍历config的每个字段，将其映射到DailySignSubmitRequest字段
  for (const configKey in config) {
    res[SignFormData2DailySignSubmitRequestDTOMapping[configKey]] =
      config[configKey];
  }

  // 返回映射后的结果
  return res;
}
