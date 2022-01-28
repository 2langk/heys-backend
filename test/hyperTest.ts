import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { BaseOutput } from 'src/common';
import { KafkaEvent, KafkaService } from 'src/globals';
import * as request from 'supertest';

class MockKafkaService {
  emit(event: KafkaEvent) {
    return event;
  }
}

export const testApp = (async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(KafkaService)
    .useClass(MockKafkaService)
    .compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();
  app.setGlobalPrefix('/api');

  return await app.init();
})();

/** export type HyperTest = Awaited<ReturnType<typeof initHyperTest>>; Awaited 이슈...*/
export type HyperTest = {
  get: <T extends BaseOutput>(
    uri: string,
  ) => {
    superTest: request.Test;
    authToken: (token?: string) => {
      query: (query?: any) => Promise<T>;
    };
  };
  post: <T extends BaseOutput>(
    uri: string,
  ) => {
    superTest: request.Test;
    authToken: (token?: string) => {
      data: (data?: any) => Promise<T>;
    };
  };
  patch: <T extends BaseOutput>(
    uri: string,
  ) => {
    superTest: request.Test;
    authToken: (token?: string) => {
      data: (data?: any) => Promise<T>;
    };
  };
  put: <T extends BaseOutput>(
    uri: string,
  ) => {
    superTest: request.Test;
    authToken: (token?: string) => {
      data: (data?: any) => Promise<T>;
    };
  };
  delete: <T extends BaseOutput>(
    uri: string,
  ) => {
    superTest: request.Test;
    authToken: (token?: string) => {
      data: (data?: any) => Promise<T>;
    };
  };
};

let hyperTest: HyperTest;
export const initHyperTest = async () => {
  if (hyperTest) {
    return hyperTest;
  }

  const superTest = request((await testApp).getHttpServer());

  const hyperGet = <T extends BaseOutput>(uri: string) => {
    const getRequest = superTest.get(uri);

    return {
      superTest: getRequest,
      authToken: (token?: string) => {
        if (token) getRequest.set('authorization', `Bearer ${token}`);
        return {
          query: async (query?: any) => {
            if (query) getRequest.query(query);
            return (await getRequest).body as T;
          },
        };
      },
    };
  };

  const hyperPost = <T extends BaseOutput>(uri: string) => {
    const postRequest = superTest.post(uri);

    return {
      superTest: postRequest,
      authToken: (token?: string) => {
        if (token) postRequest.set('authorization', `Bearer ${token}`);
        return {
          data: async (data?: any) => {
            if (data) postRequest.send(data);
            return (await postRequest).body as T;
          },
        };
      },
    };
  };

  const hyperPatch = <T extends BaseOutput>(uri: string) => {
    const patchRequest = superTest.patch(uri);

    return {
      superTest: patchRequest,
      authToken: (token?: string) => {
        if (token) patchRequest.set('authorization', `Bearer ${token}`);
        return {
          data: async (data?: any) => {
            if (data) patchRequest.send(data);
            return (await patchRequest).body as T;
          },
        };
      },
    };
  };

  const hyperPut = <T extends BaseOutput>(uri: string) => {
    const putRequest = superTest.put(uri);

    return {
      superTest: putRequest,
      authToken: (token?: string) => {
        if (token) putRequest.set('authorization', `Bearer ${token}`);
        return {
          data: async (data?: any) => {
            if (data) putRequest.send(data);
            return (await putRequest).body as T;
          },
        };
      },
    };
  };

  const hyperDelete = <T extends BaseOutput>(uri: string) => {
    const deleteRequest = superTest.delete(uri);

    return {
      superTest: deleteRequest,
      authToken: (token?: string) => {
        if (token) deleteRequest.set('authorization', `Bearer ${token}`);
        return {
          data: async (data?: any) => {
            if (data) deleteRequest.send(data);
            return (await deleteRequest).body as T;
          },
        };
      },
    };
  };

  hyperTest = {
    get: hyperGet,
    post: hyperPost,
    put: hyperPut,
    patch: hyperPatch,
    delete: hyperDelete,
  };

  return hyperTest;
};
