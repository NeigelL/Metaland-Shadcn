import { Schema, Model , models, model} from "mongoose"

export interface IVerificationToken {
  identifier: string; // email
  tokenHash: string;  // bcrypt hash of the 6-digit code
  expires: Date;
  createdAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, index: true, required: true },
  tokenHash: { type: String, required: true },
  expires: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: () => new Date(), index: true },
});

const VerificationToken: Model<IVerificationToken> = models?.VerificationToken || model<IVerificationToken>("VerificationToken", VerificationTokenSchema,"verification_tokens");

export default VerificationToken;
