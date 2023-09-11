import { Injectable, Logger } from '@nestjs/common'; // 导入NestJS的Injectable装饰器和Logger
import { SignService } from '../sign.service'; // 导入SignService
import { ApartmentSignApiEnum } from '../../constant/dailySignApiEnum'; // 导入公寓签到API枚举
import { ApartmentSignApiService } from '../../api/apartmentSignApi.service'; // 导入公寓签到API服务
import { HttpService } from '../../../http/service/impl/http.service'; // 导入HttpService
import { SignApiService } from '../../api/signApi.service'; // 导入登录API服务
import {
  getSubmitSignRequest,
  SubmitSignRequest,
} from '../../dto/apartmentSignSubmit.dto'; // 导入提交晚归签到请求和响应数据类型

@Injectable() // 使用NestJS的Injectable装饰器，将该类标记为一个可注入的服务
export class ApartmentSignService extends SignService {
  private readonly logger = new Logger(ApartmentSignService.name); // 创建一个Logger实例，用于记录日志信息

  protected indexPageUrl = ApartmentSignApiEnum.indexPageUrl; // 公寓签到首页的URL
  protected loginApi = ApartmentSignApiEnum.loginApi; // 公寓签到登录API的URL

  constructor(
    protected readonly httpService: HttpService,
    protected readonly signApiService: SignApiService,
    protected readonly apartmentSignApiService: ApartmentSignApiService,
  ) {
    super(httpService, signApiService);
  }

  /**
   * 晚归打卡
   * @param param 部分提交晚归签到的请求参数
   */
  async doSign(param: Partial<SubmitSignRequest>) {
    const isAvailable = await this.apartmentSignApiService.isAvailableSign();
    if (!isAvailable) {
      return { result: true, message: '已经打卡完成' };
    }
    const signList = await this.apartmentSignApiService.getSignList();
    if (signList.aaData.length === 0 || signList.aaData[0].VALID === '0') {
      return { result: true, message: '暂无可用的晚归打卡' };
    }
    const signConfig = signList.aaData.shift();
    const taskId = signConfig.DM; // 获取任务ID
    const sjdm = signConfig.SJDM; // 获取时间段ID
    const res = await this.apartmentSignApiService.getTaskScope(taskId); // 获取任务范围
    const pos = res[0].position; // 获取位置坐标
    const posText = res[0].mc; // 获取位置描述
    const result = await this.apartmentSignApiService.submitSign(
      getSubmitSignRequest({
        zb: pos, // 坐标
        sjdm, // 时间段ID
        dm: taskId, // 任务ID
        wz: posText, // 位置描述
        ...param, // 部分请求参数
      }),
    ); // 提交晚归签到请求
    return {
      result: result.result, // 是否成功
      message: result.msg, // 响应消息
    };
  }
}
