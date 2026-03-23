const request = require('supertest');
const app = require('../index');
const fs = require('fs');

describe('Electricity API Endpoints', () => {


const loadData = (file) => {
  return JSON.parse(fs.readFileSync(`./data/${file}`, 'utf8'));
};


//Test API1 Valid Case
it('VALID - GET /api/usage/total-by-year', async()=> {
    const data = loadData('electricity_usages_en.json');

  // calculate expected
    const expected = data.reduce((acc, curr) => {
    const year = curr.year;

    const totalUsage = Object.keys(curr)
      .filter(key => key.endsWith('_kwh'))
      .reduce((sum, key) => sum + (curr[key] || 0), 0);

    acc[year] = (acc[year] || 0) + totalUsage;
    return acc;
    }, {});


    const res = await request(app).get('/api/usage/total-by-year');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expected);

});
//Test API1 Invalid Case
it('INVALID - GET /api/usage/total-by-year (wrong method)', async () => {
    const res = await request(app).post('/api/usage/total-by-year');
    expect(res.statusCode).toBe(404);
}); 

//Test API2 Valid Case
it('VALID - GET /api/users/total-by-year', async()=> {
    const data = loadData('electricity_users_en.json');

  // calculate expected
    const expected = data.reduce((acc, curr) => {
    const year = curr.year;

    const totalUsage = Object.keys(curr)
      .filter(key => key.endsWith('_count'))
      .reduce((sum, key) => sum + (curr[key] || 0), 0);

    acc[year] = (acc[year] || 0) + totalUsage;
    return acc;
    }, {});


    const res = await request(app).get('/api/users/total-by-year');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expected);

});
//Test API2 Invalid Case
it('INVALID - GET /api/users/total-by-year (wrong method)', async () => {
    const res = await request(app).post('/api/users/total-by-year');
    expect(res.statusCode).toBe(404);
}); 

//Test API3 Valid Case 
it('VALID - GET /api/usage/:province/:year', async () => {

    const data = loadData('electricity_usages_en.json');

    const province = 'Krabi';
    const year = 2566;

    const expected = data.find(
        d =>
        d.province_name.toLowerCase() === province.toLowerCase() &&
        d.year == year
    );

    const res = await request(app).get('/api/usage/Krabi/2566');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expected);
});
//Test API3 Invalid Case 
it('INVALID - GET /api/usage/:province/:year (non-existing)', async () => {
    const res = await request(app).get('/api/usage/UnknownProvince/9999');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data not found');
});

//Test API4 Valid Case
it('VALID - /api/users/:province/:year', async () => {

    const data = loadData('electricity_users_en.json');

    const province = 'Bangkok';
    const year = 2566;

    const expected = data.find(
        d =>
        d.province_name.toLowerCase() === province.toLowerCase() &&
        d.year == year
    );

    const res = await request(app).get('/api/users/Bangkok/2566');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expected);
});
//Test API4 Invalid Case
it('INVALID - GET /api/users/:province/:year (non-existing)', async () => {
    const res = await request(app).get('/api/users/UnknownProvince/9999');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data not found');
});
//Test API5 Valid Case
it('VALID - /api/usage/history/:province', async () => {
  const data = loadData('electricity_usages_en.json');

  const province = 'Bangkok';

  const expected = data.filter(
    d => d.province_name.toLowerCase() === province.toLowerCase()
  );

  const res = await request(app).get('/api/usage/history/Bangkok');

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual(expected);
});
//Test API5 Invalid Case
it('INVALID - GET /api/usage/history/:province (non-existing)', async () => {
    const res = await request(app).get('/api/usage/history/London');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
});

//Test API5 Valid Case
it('VALID - /api/users/history/:province', async () => {
  const data = loadData('electricity_users_en.json');

  const province = 'Bangkok';

  const expected = data.filter(
    d => d.province_name.toLowerCase() === province.toLowerCase()
  );

  const res = await request(app).get('/api/users/history/Bangkok');

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual(expected);
});

//Test API6 Invalid Case
it('INVALID - GET /api/users/history/:province (non-existing)', async () => {
    const res = await request(app).get('/api/users/history/London');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
});



});