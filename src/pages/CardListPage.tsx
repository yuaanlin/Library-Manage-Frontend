import React, { useEffect, useState } from 'react';
import useAPI from '@hooks/useAPI';
import { useErrorHandler } from '@hooks/useErrorHandler';
import Book from '@src/models/Book';
import { Button, Icon, Row, Table } from 'rsuite';
import Card from '@src/models/Card';
import NewCardModal from '@components/NewCardModal';

const { Column, HeaderCell, Cell } = Table;

function CardListPage() {
  const API = useAPI();
  const errorHandler = useErrorHandler();

  const [cards, setCards] = useState<Card[]>([]);
  const [isCreatingCard, setCreatingCard] = useState(false);

  async function refresh() {
    try {
      const res = await API.card.getMany();
      setCards(res);
    } catch (err) {
      errorHandler.handleError(err);
    }
  }

  async function deleteCard(cardNumber: string) {
    try {
      await API.card.delete(cardNumber);
      await refresh();
    } catch (err) {
      errorHandler.handleError(err);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return <div style={{ padding: 60 }}>
    <h2>借书证管理</h2>

    <Row style={{ margin: '18px 0 36px 0' }}>
      <Button
        style={{ marginRight: 18 }}
        appearance="primary"
        onClick={() => setCreatingCard(true)}>
        <Icon icon="plus"/>核发新借书证
      </Button>
    </Row>

    <div style={{ borderRadius: 24, padding: 18, backgroundColor: 'white' }}>
      <Table
        renderEmpty={() => <div
          style={{
            width: '100%',
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <p style={{ opacity: 0.8 }}>目前没有借书证，请从上方新增或导入</p>
        </div>}
        height={400}
        data={cards}
      >
        <Column width={120} fixed>
          <HeaderCell>卡号</HeaderCell>
          <Cell dataKey="cardNumber"/>
        </Column>

        <Column width={80} fixed>
          <HeaderCell>姓名</HeaderCell>
          <Cell dataKey="name"/>
        </Column>

        <Column width={120}>
          <HeaderCell>单位</HeaderCell>
          <Cell dataKey="department"/>
        </Column>

        <Column width={80}>
          <HeaderCell>类型</HeaderCell>
          <Cell>{(c: Card) => c.type === 'T' ? '教师' : '学生'}</Cell>
        </Column>

        <Column width={120} fixed="right">
          <HeaderCell>操作</HeaderCell>
          <Cell>
            {(rowData: Book) => {
              return (
                <div>
                  <Button
                    size="xs"
                    style={{ marginRight: 12 }}
                    appearance="primary"
                    onClick={() => deleteCard(rowData.bookNumber)}
                  >
                    编辑
                  </Button>
                  <Button
                    size="xs"
                    appearance="subtle"
                    onClick={() => deleteCard(rowData.bookNumber)}
                  >
                    删除
                  </Button>
                </div>
              );
            }}
          </Cell>
        </Column>
      </Table>
    </div>

    <NewCardModal
      isCreating={isCreatingCard}
      onCancel={() => setCreatingCard(false)}
      onCreated={() => {
        refresh();
        setCreatingCard(false);
      }}/>
  </div>;
}

export default CardListPage;
