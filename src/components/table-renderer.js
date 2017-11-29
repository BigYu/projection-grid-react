import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatProps({ key, classes = [], props = {}, events = {}, styles = {} }) {
  const forbiddenedProps = ['class', 'classes', 'className', 'style', 'styles', 'key'];

  if (!_.isEmpty(_.pick(props, forbiddenedProps))) {
    console.warn(`${forbiddenedProps.join(' or ')} is not allowed in props`); //eslint-disable-line
  }

  return _.defaults(
    key ? { key } : {},
    {
      className: classes.join(' '),
      style: styles,
    },
    _.omit(props, forbiddenedProps),
    _.reduce(events, (memo, handler, eventName) => {
      if (/^on[A-Z]/.test(eventName)) {
        console.warn('Please dont prepend your event name with "on". It may cause bugs if you use frameworks like vue.js'); //eslint-disable-line

        return { [eventName]: handler };
      }

      return { [`on${capitalizeFirstLetter(eventName)}`]: handler };
    }, {})
  );
}

function renderTrs(trs) {
  return (
    trs.map(tr => (
      <tr {...formatProps(tr)}>
        {tr.tds.map(td => (
          <td {...formatProps(td)}>
            <td.content.Component {...formatProps(td.content)} />
          </td>
        ))}
      </tr>
    ))
  );
}

export const TableRender = (props) => {
  const { table } = props.model;

  const caption = table.caption ?
    (
      <caption {...formatProps(table.caption)}>
        <table.caption.content.Component
          {...formatProps(table.caption.content)}
        />
      </caption>
    ) : null;

  const tfoot = table.tfoot ?
    (
      <tfoot {...formatProps(table.tfoot)}>
        {renderTrs(table.tfoot.trs)}
      </tfoot>
    ) : null;


  return (
    <div>
      <table {...formatProps(table)}>
        {caption}
        {table.colgroups.map(colgroup => (
          <colgroup {...formatProps(colgroup)}>
            {colgroup.cols.map(col => (
              <col {...formatProps(col)} />
            ))}
          </colgroup>
        ))}

        <thead {...formatProps(table.thead)}>
          {table.thead.trs.map(tr => (
            <tr {...formatProps(tr)}>
              {tr.ths.map(th => (
                <th {...formatProps(th)}>
                  <th.content.Component {...formatProps(th.content)} />
                </th>
              ))}
            </tr>))}
        </thead>
        {table.tbodies.map(tbody => (
          <tbody {...formatProps(tbody)}>
            {renderTrs(tbody.trs)}
          </tbody>
        ))}
        {tfoot}
      </table>
    </div>
  );
};

TableRender.defaultProps = {
  model: {},
};

TableRender.propTypes = {
  model: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
};
