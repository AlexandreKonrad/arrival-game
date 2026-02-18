export interface IGuardResult {
    succeeded: boolean;
    message?: string;
}

export interface IGuardArgument {
    argument: any;
    argumentName: string;
}

export type GuardResponse = string;

export class Guard {
  
    public static combine(guardResults: IGuardResult[]): IGuardResult {
        for(const result of guardResults){
            if(result.succeeded === false) return result;
        }

        return { succeeded: true };
    }

    public static againstNullOrUndefined(argument: any, argumentName: string): IGuardResult
    {
        if(argument === null || argument === undefined){
            return { succeeded: false, message: `${argumentName} is null or undefined` }
        } else{
            return { succeeded: true }
        }
    }

    public static againstAtLeast(numChars: number, text: string, argumentName: string): IGuardResult
    {
        if(!text || text.length < numChars){
            return { succeeded: false, message: `${argumentName} is not at least ${numChars} chars.` }
        } else{
            return { succeeded: true }
        }
    }

    
}