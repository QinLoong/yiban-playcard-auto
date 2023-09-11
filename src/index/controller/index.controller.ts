import { Controller, Get, Logger } from '@nestjs/common'; // 导入NestJS的Controller装饰器、Get装饰器和Logger
import { SchedulerRegistry } from '@nestjs/schedule'; // 导入NestJS Schedule模块中的SchedulerRegistry
import { IndexService } from '../service/impl/index.service'; // 导入自定义的IndexService

@Controller() // 使用Controller装饰器，将该类标记为NestJS的控制器类
export class IndexController {
  private readonly logger = new Logger(IndexController.name); // 创建一个Logger实例，用于记录日志信息

  constructor(
    private readonly appService: IndexService, // 注入IndexService实例，用于处理业务逻辑
    private readonly schedulerRegistry: SchedulerRegistry, // 注入SchedulerRegistry实例，用于管理定时任务
  ) {}
}

/*这段代码定义了一个名为IndexController的NestJS控制器类。控制器类通常用于处理HTTP请求，
并调用相关的服务来执行业务逻辑。在构造函数中，它注入了IndexService实例和SchedulerRegistry实例，
以便在控制器方法中可以使用它们来处理请求和管理定时任务。控制器还创建了一个Logger实例，用于记录日志信息，
以便跟踪应用程序的行为。*/