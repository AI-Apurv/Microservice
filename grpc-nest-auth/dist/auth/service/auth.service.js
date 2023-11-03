"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_service_1 = require("./jwt.service");
const auth_entity_1 = require("../auth.entity");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async register(registerRequestDto) {
        let user = await this.userModel.findOne({ where: { email: registerRequestDto.email } });
        if (user) {
            return { status: common_1.HttpStatus.CONFLICT, error: ['E-Mail already exists'] };
        }
        console.log(registerRequestDto, '+++++++++++++++++++++++++++++');
        console.log("inside the auth user--------->>>>>>", registerRequestDto.firstName, registerRequestDto.lastName, registerRequestDto.userName, registerRequestDto.email, registerRequestDto.password, registerRequestDto.contactNumber, registerRequestDto.address);
        const newUser = new this.userModel({
            firstName: registerRequestDto.firstName,
            lastName: registerRequestDto.lastName,
            userName: registerRequestDto.userName,
            email: registerRequestDto.email,
            password: await this.jwtService.encodePassword(registerRequestDto.password),
            contactNumber: registerRequestDto.contactNumber,
            address: registerRequestDto.address
        });
        await newUser.save();
        return { status: common_1.HttpStatus.CREATED, error: null };
    }
    async login(loginRequestDto) {
        console.log("____________________________________________________", loginRequestDto.email);
        const user = await this.userModel.findOne({ email: loginRequestDto.email });
        console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL', user);
        if (!user) {
            return { status: common_1.HttpStatus.NOT_FOUND, error: ['E-Mail not found'], token: null };
        }
        const isPasswordValid = this.jwtService.isPasswordValid(loginRequestDto.password, user.password);
        if (!isPasswordValid) {
            return { status: common_1.HttpStatus.NOT_FOUND, error: ['Password wrong'], token: null };
        }
        const token = this.jwtService.generateToken(user);
        return { token, status: common_1.HttpStatus.OK, error: null };
    }
    async validate(validateRequestDto) {
        const decoded = await this.jwtService.verify(validateRequestDto.token);
        if (!decoded) {
            return { status: common_1.HttpStatus.FORBIDDEN, error: ['Token is invalid'], userId: null };
        }
        const user = await this.jwtService.validateUser(decoded);
        if (!user) {
            return { status: common_1.HttpStatus.CONFLICT, error: ['User not found'], userId: null };
        }
        return { status: common_1.HttpStatus.OK, error: null, userId: decoded.id };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(auth_entity_1.Users.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_service_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map