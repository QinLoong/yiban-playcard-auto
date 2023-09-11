import { Injectable, Logger } from '@nestjs/common'; // 导入NestJS的Injectable装饰器和Logger
import { HttpService } from 'src/http/service/impl/http.service'; // 导入自定义的HttpService
import { ApartmentSignApiEnum } from '../constant/dailySignApiEnum'; // 导入公寓签到API枚举
import {
  getTaskScopeRequest,
  TaskScopeRequest,
  TaskScopeResponse,
} from '../dto/taskScope.dto'; // 导入任务范围请求和响应数据类型
import {
  SubmitSignRequest,
  SubmitSignResponse,
} from '../dto/apartmentSignSubmit.dto'; // 导入提交签到请求和响应数据类型
import {
  apartmentSignListResponse,
  getApartmentSignListRequest,
} from '../dto/apartmentSignList.dto'; // 导入公寓签到列表响应和获取列表请求数据类型
import * as formurlencoded from 'form-urlencoded'; // 导入form-urlencoded库，用于处理表单数据编码

@Injectable() // 使用NestJS的Injectable装饰器，将该类标记为一个可注入的服务
export class ApartmentSignApiService {
  private readonly logger = new Logger(ApartmentSignApiService.name); // 创建一个Logger实例，用于记录日志信息

  constructor(private readonly httpService: HttpService) {}

  // 获取任务范围
  async getTaskScope(taskId: string) {
    const res = await this.httpService
      .getInstance()
      .get<TaskScopeResponse>(ApartmentSignApiEnum.getTaskScope, {
        params: getTaskScopeRequest({
          task: taskId,
        }),
      });
    return res.data;
  }

  // 提交签到
  async submitSign(param: SubmitSignRequest) {
    const res = await this.httpService
      .getInstance()
      .post<SubmitSignResponse>(
        ApartmentSignApiEnum.submitSign,
        formurlencoded(param), // 将参数编码为form-urlencoded格式
        {
          params: {
            _t_s_: Date.now().toString(),
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      );
    return res.data;
  }

  // 获取签到列表
  async getSignList() {
    const res = await this.httpService
      .getInstance()
      .get<apartmentSignListResponse>(ApartmentSignApiEnum.signList, {
        params: getApartmentSignListRequest(),
      });
    return res.data;
  }

  // 检查是否可签到
  async isAvailableSign() {
    const data = await this.getSignList();
    if (data.aaData.length === 0) return false; // 如果签到列表为空，返回false
    return !data.aaData[0].QDSJ; // 检查签到时间字段，如果为空则返回true，否则返回false
  }
}


/*这段代码定义了一个名为 ApartmentSignApiService 的 NestJS 服务，用于处理与公寓签到相关的API请求。
它依赖于 HttpService 来发送HTTP请求，并包括以下主要功能：

getTaskScope：获取任务范围的信息。
submitSign：提交签到请求，并将参数编码为 application/x-www-form-urlencoded 格式。
getSignList：获取签到列表的信息。
isAvailableSign：检查是否可以进行签到，根据签到时间字段的情况返回布尔值。
这个服务用于与公寓签到的后端API进行通信，并处理相关的数据请求和响应。*/