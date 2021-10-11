import { Injectable } from '@nestjs/common';
import NodeAuth from 'simp-node-auth';
import * as uuidv4 from 'uuid';

@Injectable()
export class ToolsService {
  private nodeAuth: NodeAuth;

  constructor() {
    this.nodeAuth = new NodeAuth();
  }

  /**
   * @Description: Use uuid to generate token, here you can also pass user id and splicing with it
   * @param {*}
   * @return {*}
   */
  public get uuidToken(): string {
    return uuidv4.v4().replace(/-/g, '');
  }

  /**
   * @Description: Password encryption method
   * @param {string} password
   * @return {*}
   */
  makePassword(password: string): string {
    return this.nodeAuth.makePassword(password);
  }

  /**
   * @Description: Verify password
   * @param {string} password Unencrypted password
   * @param {string} sqlPassword Encrypted password
   * @return {*}
   */
  checkPassword(password: string, sqlPassword: string): boolean {
    return this.nodeAuth.checkPassword(password, sqlPassword);
  }
}
