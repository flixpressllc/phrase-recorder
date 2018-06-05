enum Onceable {
  Warn,
  Log,
  Error,
}

const SPECIAL_UNDEFINED = {undefined: true};

class ConsoleOnce {
  private warnings: any[] = [];
  private logs: any[] = [];
  private errors: any[] = [];

  /**
   * Will call `console.warn` once only for every unique (===) object passed to
   * the `message` param.
   *
   * @param message Same as `console.warn`'s first param. This param will determine caching.
   * @param optionalParams Same as `console.warn`'s remaining params.
   */
  warn(message?: any, ...optionalParams: any[]) {
    this.doMessage(Onceable.Warn, [message].concat(optionalParams));
  }

  /**
   * Will call `console.log` once only for every unique (===) object passed to
   * the `message` param.
   *
   * @param message Same as `console.log`'s first param. This param will determine caching.
   * @param optionalParams Same as `console.log`'s remaining params.
   */
  log(message?: any, ...optionalParams: any[]) {
    this.doMessage(Onceable.Log, [message].concat(optionalParams));
  }

  /**
   * Will call `console.error` once only for every unique (===) object passed to
   * the `message` param.
   *
   * @param message Same as `console.error`'s first param. This param will determine caching.
   * @param optionalParams Same as `console.error`'s remaining params.
   */
  error(message?: any, ...optionalParams: any[]) {
    this.doMessage(Onceable.Error, [message].concat(optionalParams));
  }

  /**
   * Will call `console.warn` once only for every unique (===) object passed to
   * the `id` param.
   *
   * @param id This param will determine caching.
   * @param message Same as `console.warn`'s first param.
   * @param optionalParams Same as `console.warn`'s remaining params.
   */
  warnWithId(id: any, message?: any, ...optionalParams: any[]) {
    this.doMessage(Onceable.Warn, [message].concat(optionalParams), id);
  }

  /**
   * Will call `console.log` once only for every unique (===) object passed to
   * the `id` param.
   *
   * @param id This param will determine caching.
   * @param message Same as `console.log`'s first param.
   * @param optionalParams Same as `console.log`'s remaining params.
   */
  logWithId(id: any, message?: any, ...optionalParams: any[]) {
    this.doMessage(Onceable.Log, [message].concat(optionalParams), id);
  }

  /**
   * Will call `console.error` once only for every unique (===) object passed to
   * the `id` param.
   *
   * @param id This param will determine caching.
   * @param message Same as `console.error`'s first param.
   * @param optionalParams Same as `console.error`'s remaining params.
   */
  errorWithId(id: any, message?: any, ...optionalParams: any[]) {
    this.doMessage(Onceable.Error, [message].concat(optionalParams), id);
  }

  private doMessage(type: Onceable, args: any[], id: any = SPECIAL_UNDEFINED) {
    const finalId = id === SPECIAL_UNDEFINED ? args[0] : id;
    if (!this.wasNotGiven(type, finalId)) {
      this.getCacheForType(type).push(finalId);
      this.getCommandForType(type)(...args);
    }
  }

  private wasGiven(type: Onceable, messageOrId: any) {
    return this.getCacheForType(type).includes(messageOrId);
  }

  private wasNotGiven(type: Onceable, messageOrId: any) {
    return ! this.wasGiven(type, messageOrId);
  }

  private getCacheForType(type: Onceable): any[] {
    switch (type) {
      case Onceable.Warn: return this.warnings;
      case Onceable.Error: return this.errors;
      case Onceable.Log: return this.logs;
    }
  }

  private getCommandForType(type: Onceable): Console['warn'] | Console['log'] | Console['error'] {
    switch (type) {
      case Onceable.Warn: return console.warn;
      case Onceable.Error: return console.error;
      case Onceable.Log: return console.log;
    }
  }
}

const consoleOnce = new ConsoleOnce();

export { consoleOnce };
