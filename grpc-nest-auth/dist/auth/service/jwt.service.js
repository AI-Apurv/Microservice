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
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const auth_entity_1 = require("../auth.entity");
const bcrypt = require("bcryptjs");
let JwtService = class JwtService {
    constructor(userModel, jwt) {
        this.userModel = userModel;
        this.jwt = jwt;
    }
    async decode(token) {
        return this.jwt.decode(token, null);
    }
    async validateUser(decoded) {
        return this.userModel.findOne(decoded.id).exec();
    }
    generateToken(user) {
        return this.jwt.sign({ id: user._id, email: user.email });
    }
    isPasswordValid(password, userPassword) {
        return bcrypt.compare(password, userPassword);
    }
    async encodePassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async verify(token) {
        try {
            return this.jwt.verify(token);
        }
        catch (err) {
            throw new Error('Invalid token');
        }
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(auth_entity_1.Users.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], JwtService);
//# sourceMappingURL=jwt.service.js.map