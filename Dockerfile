from node:7.7.2 
RUN mkdir /tools
RUN mkdir /tools/node_modules
WORKDIR /tools
COPY ./node_modules/ /tools/node_modules/

COPY run.js /tools/

EXPOSE 7801
ENTRYPOINT ["node", "run.js"]
