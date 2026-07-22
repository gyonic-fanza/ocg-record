import type { NewEventType } from '../schema/eventType';

export const initialEventTypes: NewEventType[] = [
  {
    name: 'ランキングデュエル',
    description: '店舗で開催されるランキング対象イベント',
  },
  {
    name: '遊戯王の日',
    description: '新商品発売に合わせて開催される交流イベント',
  },
  {
    name: '日本選手権',
    description: '日本選手権および店舗・エリア予選',
  },
  {
    name: 'YCSJ',
    description: 'Yu-Gi-Oh! CHAMPIONSHIP SERIES JAPAN',
  },
  {
    name: 'インストラクター運営イベント',
    description: '遊戯王OCGインストラクターが運営するイベント',
  },
  {
    name: 'ショップ大会',
    description: '店舗独自の大会',
  },
  {
    name: '交流会',
    description: '勝敗より交流を主目的とするイベント',
  },
  {
    name: 'フリー対戦',
    description: '大会やイベントに属さない対面での対戦',
  },
  {
    name: 'リモート対戦',
    description: 'オンライン通話などを利用した対戦',
  },
  {
    name: 'その他',
    description: '上記に該当しないイベント',
  },
];