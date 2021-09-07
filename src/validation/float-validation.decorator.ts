import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsFloat2Decimal(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isFloat2Decimal',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions
        ? validationOptions
        : { message: 'property must be float number with 2 decimal' },
      validator: {
        validate(value: number) {
          const float2DecimalReExp = /^[0-9]*(\.[0-9]{0,2})?$/;
          return float2DecimalReExp.test(value.toString());
        },
      },
    });
  };
}
