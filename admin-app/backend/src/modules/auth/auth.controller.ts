import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

class LoginDto {
  email: string;
  password: string;
}

@ApiTags("Admin Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Admin login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    console.log("📥 [AUTH CONTROLLER] Received login request");
    console.log("📧 [AUTH CONTROLLER] Email:", loginDto.email);
    console.log(
      "🔐 [AUTH CONTROLLER] Password length:",
      loginDto.password?.length || 0
    );

    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password
      );
      console.log("✅ [AUTH CONTROLLER] Login successful, sending response");
      return result;
    } catch (error) {
      console.error("❌ [AUTH CONTROLLER] Login failed:", error.message);
      throw error;
    }
  }
}
