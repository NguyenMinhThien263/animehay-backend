'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      userName:'Admin',
      email: 'admin@gmail.com',
      password: '123456',
      firstName: 'Thien',
      lastName: 'Nguyen',
      address: 'aibiet',
      roleId:'1',
      image:'',
      address:'',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
