import { Injectable, Logger } from '@nestjs/common'; // 导入NestJS的Injectable装饰器和Logger
import { HttpService } from '../../http/service/impl/http.service'; // 导入自定义的HttpService
import { DailySignApiEnum } from '../constant/dailySignApiEnum'; // 导入日常签到API枚举
import * as formurlencoded from 'form-urlencoded'; // 导入form-urlencoded库，用于处理表单数据编码
import {
  DailySignSubmitRequest,
  DailySignSubmitResponse,
  SignLogRequest,
  SignLogResponse,
} from '../dto/dailySignSubmit.dto'; // 导入日常签到提交请求和响应数据类型

@Injectable() // 使用NestJS的Injectable装饰器，将该类标记为一个可注入的服务
export class DailySignApiService {
  private readonly logger = new Logger(); // 创建一个Logger实例，用于记录日志信息

  constructor(private readonly httpService: HttpService) {}

  // 获取签到页面
  async getSignPage() {
    const res = await this.httpService
      .getInstance()
      .get(DailySignApiEnum.signPageApi, {
        params: {
          _t_s_: Date.now(),
        },
        headers: {
          Referer: `http://xggl.hnie.edu.cn/wap/menu/student/temp/zzdk?_t_s_=${
            Date.now() - 3
          }`,
        },
      });
    return res.data;
  }

  // 提交签到
  async submitSign(
    param: Omit<DailySignSubmitRequest, 'zzdk_token'>,
    token: string,
  ) {
    const res = await this.httpService
      .getInstance()
      .post<DailySignSubmitResponse>(
        DailySignApiEnum.patchSignApi,
        formurlencoded({
          ...param,
          zzdk_token: token,
        } as DailySignSubmitRequest),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      );
    return res.data;
  }

  // 获取签到日志
  async getSignLog() {
    const result = await this.httpService
      .getInstance()
      .get<SignLogResponse>(DailySignApiEnum.signLogApi, {
        params: {
          bSortable_0: false,
          bSortable_1: true,
          iSortingCols: 1,
          iDisplayStart: 0,
          iDisplayLength: 12,
          iSortCol_0: 1,
          sSortDir_0: 'desc',
          _t_s_: Date.now(),
        } as SignLogRequest,
      });
    return result.data;
  }
}
