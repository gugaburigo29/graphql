import {app, chai, db, expect, handleError} from './../text-utils'

describe('User', () => {

    beforeEach(() => {
        return db.Comment.destroy({where: {}})
            .then((rows: number) => db.Post.destroy({where: {}}))
            .then((rows: number) => db.User.destroy({where: {}}))
            .then((rows: number) => db.User.create(
                {
                    name: 'Peter Quill',
                    email: 'peter@guardians.com',
                    password: '1234'
                }
            ));
    });

    describe('Queries', () => {

        describe('application/json', () => {

            describe('users', () => {

                it('should return a list of users', () => {

                    const body = {
                        query: `
                            query{
                                users {
                                    name
                                    email
                                }
                            }
                        `
                    }

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            expect(res.body.data).to.be.an('object')
                        }).catch(handleError)
                });

            })

        })

    })

});
