import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FreezePipe implements PipeTransform {
  private logger = new Logger(FreezePipe.name);
  transform(value: any, _: ArgumentMetadata) {
    // Avoid modificatio/addition of properties
    Object.freeze(value);
    this.logger.log(`Value ${JSON.stringify(value)} freezed`);
    return value;
  }
}
