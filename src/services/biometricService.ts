import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: string;
}

export class BiometricService {
  /**
   * Check if biometric authentication is available on the device
   */
  static async isAvailable(): Promise<BiometricResult> {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      
      if (available) {
        return {
          success: true,
          biometryType: biometryType || 'Unknown'
        };
      } else {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Error checking biometric availability: ${error}`
      };
    }
  }

  /**
   * Authenticate using biometrics (Face ID, Touch ID, or device credentials)
   */
  static async authenticate(reason: string = 'Authenticate to access your todos'): Promise<BiometricResult> {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: reason,
        cancelButtonText: 'Cancel'
      });

      if (success) {
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: 'Authentication was cancelled or failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Biometric authentication failed: ${error}`
      };
    }
  }

  /**
   * Create biometric keys for secure storage
   */
  static async createKeys(): Promise<BiometricResult> {
    try {
      const { publicKey } = await rnBiometrics.createKeys();
      return {
        success: true,
        biometryType: publicKey ? 'Keys created successfully' : 'Failed to create keys'
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create biometric keys: ${error}`
      };
    }
  }

  /**
   * Delete biometric keys
   */
  static async deleteKeys(): Promise<BiometricResult> {
    try {
      await rnBiometrics.deleteKeys();
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete biometric keys: ${error}`
      };
    }
  }

  /**
   * Get the type of biometric authentication available
   */
  static getBiometryTypeName(biometryType: string): string {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.Biometrics:
        return 'Biometric Authentication';
      default:
        return 'Device Authentication';
    }
  }
}
