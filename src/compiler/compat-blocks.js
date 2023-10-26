/**
 * @fileoverview List of blocks to be supported in the compiler compatibility layer.
 * This is only for native blocks. Extensions should not be listed here.
 */

// Please keep these lists alphabetical.
// me: no, don't care (sorry)

const stacked = [
    'looks_changestretchby',
    'looks_hideallsprites',
    'looks_say',
    'looks_sayforsecs',
    'looks_setstretchto',
    'looks_switchbackdroptoandwait',
    'looks_think',
    'looks_thinkforsecs',
    'motion_align_scene',
    'motion_glidesecstoxy',
    'motion_glideto',
    'motion_goto',
    'motion_pointtowards',
    'motion_scroll_right',
    'motion_scroll_up',
    'sensing_askandwait',
    'sensing_setdragmode',
    'sound_changeeffectby',
    'sound_changevolumeby',
    'sound_cleareffects',
    'sound_play',
    'sound_playuntildone',
    'sound_seteffectto',
    'sound_setvolumeto',
    'sound_stopallsounds',
    'motion_moveupdownsteps',
    'motion_move_sprite_to_scene_side',
    'data_listforeachnum',
    'data_listforeachitem'
/*     'motion_pointinrandomdirection',
    'motion_changebyxy',
    'motion_pointtowardsxy',
    'motion_turnaround',
    'motion_turnleftaroundxy',
    'motion_turnrightaroundxy',
    'motion_movebacksteps',
    'motion_ifonspritebounce',
    'motion_ifonxybounce' */
];

const inputs = [
    'motion_xscroll',
    'motion_yscroll',
    'sensing_loud',
    'sensing_loudness',
    'sensing_userid',
    'sound_volume',
    'sensing_mousescrolling'
];

module.exports = {
    stacked,
    inputs
};
