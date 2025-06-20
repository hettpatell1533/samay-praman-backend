import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class CryptoService {
  private static algorithm = 'aes-256-cbc';
  private static key = process.env.ENC_KEY || '';
  private static iv = process.env.ENC_IV || '';

  /*
   * encrypts and decrypts data usign AES-256-CBC algorithm and a key provided in the environment variables
   * to generate a key and iv, use the following commands in the terminal:
   * openssl rand -hex 32
   * openssl rand -hex 16
   */

  public static encrypt(text: string): string {
    text = this.pad(text);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.key, 'hex'),
      Buffer.from(this.iv, 'hex'),
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  public static decrypt(text: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key, 'hex'),
      Buffer.from(this.iv, 'hex'),
    );
    let decrypted = decipher.update(Buffer.from(text, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return this.unpad(decrypted.toString());
  }
  private static pad(text: string): string {
    const blockSize = 16;
    const padding = blockSize - (text.length % blockSize);
    const padChar = String.fromCharCode(padding);
    return text + padChar.repeat(padding);
  }
  private static unpad(text: string): string {
    const lastChar = text.charCodeAt(text.length - 1);
    return text.slice(0, text.length - lastChar);
  }

  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public static comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}

export class Validation {
  public static validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  public static validateMobile(mobile: string): boolean {
    const re = /^\d{10}$/;
    return re.test(mobile);
  }

  //validate empty string
  public static validateEmptyString(str: string): boolean {
    const re = /^\s*$/;
    return re.test(str);
  }

  //validateOTP 4 digit number
  public static validateOTP(otp: string): boolean {
    const re = /^\d{4}$/;
    return re.test(otp);
  }
}

export class Masking {
  public static maskEmail(email: string): string {
    const re = /(?<=.{1}).(?=.*@)/g;
    return email.replace(re, '*');
  }

  public static maskMobile(mobile: string): string {
    const re = /(?<=.{2}).(?=.{3}$)/g;
    return mobile.replace(re, '*');
  }
}

export class Utility {
  public static slugify(str: string): string {
    // const extension = str.split('.').pop();
    return str
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric characters with a hyphen
      .replace(/^-+|-+$/g, ''); // remove leading and trailing hyphens
  }
}

export class DateUtil {
  static dateObjectFromMySQLDate = (date: string): Date => {
    return new Date(date);
  };
  static dateTimeObjectFromMySQLDateTime = (date: string): Date => {
    return new Date(date);
  };
  static mySQLDateFromDateObject = (date: Date): string => {
    const year = `${date.getFullYear}`;
    let month = `${date.getMonth() + 1}`;
    if (month.length === 1) month = `0${month}`;
    let day = `${date.getDate()}`;
    if (day.length === 1) day = `0${day}`;
    return `${year}-${month}-${day}`;
  };
  static mySQLDateTimeFromDateObject = (date: Date): string => {
    const year = `${date.getFullYear()}`;
    let month = `${date.getMonth() + 1}`;
    if (month.length === 1) month = `0${month}`;
    let day = `${date.getDate()}`;
    if (day.length === 1) day = `0${day}`;
    let hour = `${date.getHours()}`;
    if (hour.length === 1) hour = `0${hour}`;
    let minute = `${date.getMinutes()}`;
    if (minute.length === 1) minute = `0${minute}`;
    let second = `${date.getSeconds()}`;
    if (second.length === 1) second = `0${second}`;
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  };
}