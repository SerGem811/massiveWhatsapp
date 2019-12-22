import axios from 'axios'

import {
  REPONSES_URL,
  BULK_DATA_URL,
  USER_DATA_URL
} from './endpoints'


export function setResponse (response) {

  return axios({
    method: 'POST',
    url: REPONSES_URL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: response
  })
}

export function getAllResponses (pagination) {
    let start = (pagination.currentPage * pagination.pageSize) - pagination.pageSize
    let limit = pagination.pageSize
  
    let url =  REPONSES_URL + '?_start=' + start + '&_limit=' + limit + '&_sort=order:asc'
  
    return axios({
      method: 'GET',
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
}

export function updateResponse (id, response) {
    return axios({
      method: 'PUT',
      url: REPONSES_URL + '/' + id,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: response
    })
}


export async function deleteResponse (id) {
    return await axios({
      method: 'DELETE',
      url: REPONSES_URL + '/' + id,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
}

export function getResponse (id) {
    return axios({
      method: 'GET',
      url: REPONSES_URL + '/' + id,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
}

export function countResponses () {
    return axios({
      method: 'GET',
      url: REPONSES_URL + '/count',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
}

export function setBulkData (data) {
  return axios({
    method: 'POST',
    url: BULK_DATA_URL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data
  })
}

export function getUser () {
  return axios({
    method: 'GET',
    url: USER_DATA_URL + '/1',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
}

export function updateUser (data) {
  return axios({
    method: 'PUT',
    url: USER_DATA_URL + '/1',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('auth._token.local')}`
    },
    data
  })
}

export function getBulkData () {
  return axios({
    method: 'GET',
    url: BULK_DATA_URL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}