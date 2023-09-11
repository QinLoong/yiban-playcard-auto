import { Injectable, Logger } from '@nestjs/common'; // 导入NestJS的Injectable装饰器和Logger
import { Cron } from '@nestjs/schedule'; // 导入NestJS Schedule模块中的Cron装饰器
import { IUserOptions } from 'src/types/interface'; // 导入用户选项接口
import { DailySignService } from '../../../user/service/impl/dailySign.service'; // 导入日常签到服务
import { ConfigService } from '@nestjs/config'; // 导入NestJS配置服务
import * as JSON5 from 'json5'; // 导入JSON5库，用于解析JSON5格式的配置
import * as CryptoJS from 'crypto-js/core'; // 导入CryptoJS库，用于解密配置
import 'crypto-js/enc-base64'; // 导入CryptoJS的Base64解码
import { ApartmentSignService } from '../../../user/service/impl/apartmentSign.service'; // 导入晚归签到服务
import { SignConfig, signFormData } from 'src/index/dto/signConfigDTO'; // 导入签到配置和签到表单数据类型
import { SignService } from '../../../user/service/sign.service'; // 导入签到服务
import { DailySignSubmitRequest } from '../../../user/dto/dailySignSubmit.dto'; // 导入日常签到提交请求类型
import { signForm2DailySignSubmitRequestDTOMapping } from '../../dto/signFormData2DailySignSubmitRequestDTOMapping'; // 导入签到表单数据到请求类型的映射
import { UtilService } from '../../../http/service/impl/util.service'; // 导入工具服务

@Injectable() // 使用NestJS的Injectable装饰器，将该类标记为一个可注入的服务
export class IndexService {
  private readonly logger = new Logger(IndexService.name); // 创建一个Logger实例，用于记录日志信息

  private readonly signConfig: SignConfig = []; // 存储签到配置信息的数组

  private accountData: IUserOptions; // 存储用户选项的数据

  constructor(
    private readonly dailySignService: DailySignService, // 注入日常签到服务
    private readonly apartmentSignService: ApartmentSignService, // 注入晚归签到服务
    private readonly configService: ConfigService, // 注入NestJS配置服务
    private readonly utilService: UtilService, // 注入工具服务
  ) {
    this.signConfig = this.getSignConfig(); // 从配置中获取签到配置信息并存储在signConfig中
  }

  // 从配置中获取签到配置信息
  private getSignConfig(): SignConfig {
    try {
      if (this.configService.get('SIGN_CONFIG_BASE64')) {
        // 尝试解析BASE64编码的配置信息
        return JSON5.parse(
          CryptoJS.enc.Base64.parse(
            this.configService.get<string>('SIGN_CONFIG_BASE64'),
          ).toString(CryptoJS.enc.Utf8),
        );
      }
    } catch (e) {
      this.logger.error('SIGN_CONFIG_BASE64配置解析错误: ' + e.toString());
    }
    try {
      // 尝试解析普通的JSON配置信息
      const config = this.configService.get<string>('SIGN_CONFIG');
      return JSON5.parse(config);
    } catch (e) {
      this.logger.error('SIGN_CONFIG配置解析错误: ' + e.toString());
    }
    return [];
  }

  // 通用的签到逻辑
  protected async commonSign(
    loadUserGenerator: Generator,
    signService: SignService,
    loggerName: string,
  ) {
    this.utilService.getServiceIp(true); // 获取服务IP并记录到日志
    const it = loadUserGenerator;
    let param = it.next();
    while (!param.done && param.value) {
      signService.setUser(this.accountData); // 设置用户选项
      const loginStatus = await signService.doLogin(); // 执行登录操作
      const currentUserSummary = this.accountData.account.substring(
        this.accountData.account.length - 4,
      );
      if (loginStatus !== true) {
        // 如果登录失败，记录警告日志
        this.logger.warn(
          `[${currentUserSummary}]登录失败: ${loginStatus?.msg}`,
        );
        param = it.next();
        continue;
      }
      const res = await signService.doSign(param.value); // 执行签到操作
      this.logger.log(
        `[${currentUserSummary}] [${loggerName}]: ${
          res.result ? '成功' : '失败'
        } 返回消息: ${res?.message}`,
      );
      param = it.next();
    }
  }

  /**
   * 日常打卡定时任务
   */
  @Cron('0 1 6 * * *')
  async dailySign() {
    this.logger.log('===========日常打卡开始');
    const it = this.loadUser(
      'dailySignFormData',
      signForm2DailySignSubmitRequestDTOMapping,
    );
    await this.commonSign(it, this.dailySignService, '日常打卡');
    this.logger.log('===========日常打卡结束');
  }

  /**
   * 晚归签到定时任务
   
  @Cron('0 2 22 * * *')
  async apartmentSign() {
    this.logger.log('===========晚归签到开始');
    const it = this.loadUser('apartmentSignFormData');
    await this.commonSign(it, this.apartmentSignService, '晚归打卡');
    this.logger.log('===========晚归签到结束');
  }*/

  //周日到周四
  @Cron('0 52 22 * * *')
  async apartmentSign() {
    this.logger.log('===========晚归签到开始');
    const it = this.loadUser('apartmentSignFormData');
    await this.commonSign(it, this.apartmentSignService, '晚归打卡');
    this.logger.log('===========晚归签到结束');
  }


  //周五，周六
  @Cron('0 22 23 * * *')
  async apartmentSign2() {
    this.logger.log('===========晚归签到开始');
    const it = this.loadUser('apartmentSignFormData');
    await this.commonSign(it, this.apartmentSignService, '晚归打卡');
    this.logger.log('===========晚归签到结束');
  }

  // 生成用户迭代器
  private *loadUser<T extends keyof SignConfig[number]>(
    key: T,
    translateFn?: (formData: SignConfig[number][T]) => unknown,
  ) {
    for (const signConfigElement of this.signConfig) {
      this.accountData = signConfigElement.account;
      if (translateFn) yield translateFn(signConfigElement[key]);
      else yield signConfigElement[key];
    }
  }
}
