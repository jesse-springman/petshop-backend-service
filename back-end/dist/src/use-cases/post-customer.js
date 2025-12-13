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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCustomer = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/database/prisma.service");
let PostCustomer = class PostCustomer {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(customer_name, pet_name) {
        const client = await this.prisma.customer.create({
            data: {
                customer_name,
                pet_name
            }
        });
        return client;
    }
};
exports.PostCustomer = PostCustomer;
exports.PostCustomer = PostCustomer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostCustomer);
//# sourceMappingURL=post-customer.js.map