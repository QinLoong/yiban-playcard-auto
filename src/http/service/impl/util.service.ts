/*
这段代码定义了一个名为UtilService的类，用于获取服务器的IP地址。
它依赖于HttpService来发送HTTP请求。如果isEchoLog参数为true，它还会将获取到的IP地址记录到日志中。
*/
import { Injectable, Logger } from "@nestjs/common"; // 导入NestJS的Injectable装饰器和Logger
import { HttpService } from "./http.service"; // 导入自定义的HttpService

@Injectable() // 使用NestJS的Injectable装饰器，将该类标记为一个可注入的服务
export class UtilService {
  private readonly logger = new Logger(UtilService.name); // 创建一个Logger实例

  constructor(private readonly httpService: HttpService) {}

  // 异步函数，用于获取服务IP地址
  async getServiceIp(isEchoLog = false) {
    try {
      // 使用HttpService实例来发送HTTP GET请求并获取响应
      const res = await this.httpService
        .getInstance()
        .get<string>("http://test.ipw.cn/");

      // 使用正则表达式提取响应中的IP地址
      const ipReg =
        /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/i;
      const ip = ipReg.exec(res.data)[0];

      // 如果isEchoLog为true，将IP地址记录到日志中
      if (isEchoLog) {
        this.logger.log(`当前服务器IP：${ip}`);
      }

      // 返回获取到的IP地址
      return ip;
    } catch (e) {
      // 捕获异常并记录到日志中
      this.logger.log("获取服务器IP失败");
    }

    // 如果发生异常，返回null
    return null;
  }
}
