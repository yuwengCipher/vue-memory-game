
import {shuffle} from 'lib/shuffle';
import {STATUS} from 'vuex/store/statusEnum';

import {TYPES} from './types';

import Wilddog from 'wilddog/lib/wilddog-node';

const cardNames = ['8-ball', 'kronos', 'baked-potato', 'dinosaur', 'rocket', 'skinny-unicorn',
    'that-guy', 'zeppelin'];

export const reset = function({dispatch, state}) {
    dispatch(TYPES.RESET, {
        leftMatched: 8,
        highestSpeed: localStorage.getItem('highestSpeed') || 9999,
        status: STATUS.READY,
        cards: shuffle(cardNames.concat(cardNames))
            .map(name => ({flipped: false, cardName: name})),
        elapsedMs: 0,
        displayRank: false,
        displayNameInput: false,
        ranks: [],
        userName: localStorage.getItem('userName') || ''
    });
};

let timerId;

let statusHandler = {
    PLAYING: function(dispatch) {
        timerId = setInterval(function() {
            dispatch(TYPES.COUNTING);
        }, 1000);
    },

    PASS: function(dispatch) {
        clearInterval(timerId);
        dispatch(TYPES.UPDATE_HIGHESTSPEED);
        dispatch(TYPES.TOGGLE_NAMEINPUT);
    }
};

export const updateStatus = function({dispatch, state}, status) {
    dispatch(TYPES.UPDATE_STATUS, status);
    statusHandler[status] && statusHandler[status](dispatch);
};

export const updateUserName = function({dispatch, state}, name) {
    dispatch(TYPES.UPDATE_USERNAME, name);
};

export const flipCard = function({dispatch, state}, card) {
    dispatch(TYPES.FLIP, card);
};

export const flipCards = function({dispatch, state}, cards) {
    dispatch(TYPES.FLIPS, cards);
};

export const match = function({dispatch, state}) {
    dispatch(TYPES.DECREASE_MATCH);
};

export const toggleRank = function({dispatch, state}) {
    dispatch(TYPES.TOGGLE_RANK);
    dispatch(TYPES.TOGGLE_NAMEINPUT);
};

var ref = new Wilddog('https://memorygame.wilddogio.com/');

export const updateRank = function({dispatch, state}, info) {
    var usersRef = ref.child('users');
    usersRef.set({
        [encodeURIComponent(info.userName)]: {
            username: info.userName,
            speed: info.speed
        }
    });

    usersRef.on('value', function(data) {
        console.log('data', data);
    }, function(err) {
        console.log('error', err);
    });

};
