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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const create_customer_1 = require("../dto/create.customer");
const post_customer_1 = require("../use-cases/post-customer");
const get_customer_1 = require("../use-cases/get-customer");
let AppController = class AppController {
    postCustomer;
    getCustomer;
    constructor(postCustomer, getCustomer) {
        this.postCustomer = postCustomer;
        this.getCustomer = getCustomer;
    }
    async insertCustomersData(Body) {
        const { customer_name, pet_name } = Body;
        await this.postCustomer.execute(customer_name, pet_name);
        return {
            message: 'Cliente Cadastrado com sucesso',
            customer_name,
            pet_name
        };
    }
    async allCustomersData() {
        const allCustomers = await this.getCustomer.findAllClient();
        return allCustomers;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('cadastro'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_1.CreateCustomerBody]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "insertCustomersData", null);
__decorate([
    (0, common_1.Get)('customers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "allCustomersData", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [post_customer_1.PostCustomer,
        get_customer_1.GetCustomer])
], AppController);
//# sourceMappingURL=app.controller.js.map